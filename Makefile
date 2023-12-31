include .env
export

# Change per GCP Project
PROJECT_ID = theflipsecrets
PROJECT_NUMBER = 137964242252
AR_IMAGE = us-docker.pkg.dev/theflipsecrets/$(AR_REPOSITORY)/hustlesheets-close:latest

# Do not change
AR_REPOSITORY = docker-1
GH_IMAGE = ghcr.io/hieumdd/hustlesheets-close:master
QUEUER_JOB_NAME = close-etl-queuer
EXECUTOR_JOB_NAME = close-etl-executor

create-image:
	gcloud services enable artifactregistry.googleapis.com

	-gcloud artifacts repositories create $(AR_REPOSITORY) \
		--location=us \
		--repository-format=docker \
		--quiet

	gcloud auth configure-docker --quiet us-docker.pkg.dev

	docker pull --platform linux/amd64 $(GH_IMAGE)

	docker tag $(GH_IMAGE) $(AR_IMAGE)

	docker push $(AR_IMAGE)

create-job:
	gcloud services enable run.googleapis.com

	gcloud config set run/region us-central1

	-gcloud run jobs create $(QUEUER_JOB_NAME) \
		--image=$(AR_IMAGE) \
		--args="queue" \
		--set-env-vars="CLOSE_API_KEY=$(CLOSE_API_KEY),BIGQUERY_DATASET=$(BIGQUERY_DATASET)" \
		--quiet

	-gcloud run jobs create $(EXECUTOR_JOB_NAME) \
		--image=$(AR_IMAGE) \
		--args="" \
		--set-env-vars="CLOSE_API_KEY=$(CLOSE_API_KEY),BIGQUERY_DATASET=$(BIGQUERY_DATASET)" \
		--quiet

create-schedule:
	gcloud services enable cloudscheduler.googleapis.com

	-gcloud scheduler jobs create http close-etl \
		--location=us-central1 \
		--schedule="0 0 * * *" \
		--uri="https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/theflipsecrets/jobs/$(QUEUER_JOB_NAME):run" \
		--http-method=POST \
		--oauth-service-account-email=$(PROJECT_NUMBER)-compute@developer.gserviceaccount.com \
		--quiet

