AR_REPOSITORY = docker-1
GH_IMAGE = ghcr.io/hieumdd/hustlesheets-close:master
AR_IMAGE = us-docker.pkg.dev/theflipsecrets/$(AR_REPOSITORY)/hustlesheets-close:latest

push-image:
	gcloud services enable artifactregistry.googleapis.com

	-gcloud artifacts repositories create docker-1 \
		--location us \
		--repository-format docker \
		--quiet

	gcloud auth configure-docker --quiet us-docker.pkg.dev

	docker pull --platform linux/amd64 $(GH_IMAGE)
	docker tag $(GH_IMAGE) $(AR_IMAGE)
	docker push $(AR_IMAGE)
