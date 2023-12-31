import { Transform } from 'node:stream';

import { CreateLoadStreamConfig } from '../bigquery.service';
import { GetExtractStream, getIncrementalStream, getDimensionStream } from '../close/close.service';
import { Joi, timestamp, transformCustomFields, transformValidation } from './transform.utils';

export type Pipeline = {
    name: string;
    getExtractStream: GetExtractStream;
    transforms: Transform[];
    loadConfig: CreateLoadStreamConfig;
};

export const Lead: Pipeline = {
    name: 'Lead',
    getExtractStream: getIncrementalStream({
        uri: 'lead',
        paramsBuilder: ({ start, end }) => ({
            _fields: [
                'id',
                'created_by',
                'first_communication_user_id',
                'last_communication_user_id',
                'next_task_user_id',
                'primary_opportunity_pipeline_id',
                'primary_opportunity_status',
                'primary_opportunity_user_id',
                'status_id',
                'active_opportunity_value_summary',
                'contacts_summary',
                'date_created',
                'date_updated',
                'description',
                'display_name',
                'first_call_created',
                'first_call_note',
                'first_communication_date',
                'first_communication_summary',
                'first_communication_type',
                'first_source',
                'html_url',
                'last_activity_date',
                'last_activity_type',
                'last_call_created',
                'last_call_duration',
                'last_call_note',
                'last_communication_date',
                'last_communication_summary',
                'last_communication_type',
                'last_email_date',
                'last_email_subject',
                'last_incoming_email_date',
                'last_lead_status_change_date',
                'last_note_created',
                'last_outgoing_call_date',
                'localtime',
                'name',
                'next_task_date',
                'next_task_due_date',
                'next_task_text',
                'primary_email',
                'primary_phone',
                'times_communicated',
                'url',
                'won_opportunity_value_summary',
                'custom',
            ],
            query: `sort:updated date_updated >= ${start} date_updated <= ${end}`,
        }),
    }),
    transforms: [
        transformCustomFields(),
        transformValidation(
            Joi.object({
                id: Joi.string(),
                created_by: Joi.string(),
                first_communication_user_id: Joi.string(),
                last_communication_user_id: Joi.string(),
                next_task_user_id: Joi.string(),
                primary_opportunity_pipeline_id: Joi.string(),
                primary_opportunity_status: Joi.string(),
                primary_opportunity_user_id: Joi.string(),
                status_id: Joi.string(),
                active_opportunity_value_summary: Joi.string(),
                contacts_summary: Joi.string(),
                date_created: timestamp,
                date_updated: timestamp,
                description: Joi.string(),
                display_name: Joi.string(),
                first_call_created: timestamp,
                first_call_note: Joi.string(),
                first_communication_date: timestamp,
                first_communication_summary: Joi.string(),
                first_communication_type: Joi.string(),
                first_source: Joi.string(),
                html_url: Joi.string(),
                last_activity_date: timestamp,
                last_activity_type: Joi.string(),
                last_call_created: timestamp,
                last_call_duration: Joi.number(),
                last_call_note: Joi.string(),
                last_communication_date: timestamp,
                last_communication_summary: Joi.string(),
                last_communication_type: Joi.string(),
                last_email_date: timestamp,
                last_email_subject: Joi.string(),
                last_incoming_email_date: timestamp,
                last_lead_status_change_date: timestamp,
                last_note_created: timestamp,
                last_outgoing_call_date: timestamp,
                localtime: timestamp,
                name: Joi.string(),
                next_task_date: timestamp,
                next_task_due_date: timestamp,
                next_task_text: Joi.string(),
                primary_email: Joi.object({
                    email: Joi.string(),
                    type: Joi.string(),
                }),
                primary_phone: Joi.object({
                    phone_formatted: Joi.string(),
                    phone: Joi.string(),
                    type: Joi.string(),
                    country: Joi.string(),
                }),
                times_communicated: Joi.number(),
                url: Joi.string(),
                won_opportunity_value_summary: Joi.string(),
                custom: Joi.array().items({
                    id: Joi.string(),
                    value: Joi.string(),
                }),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: 'id', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'first_communication_user_id', type: 'STRING' },
            { name: 'last_communication_user_id', type: 'STRING' },
            { name: 'next_task_user_id', type: 'STRING' },
            { name: 'primary_opportunity_pipeline_id', type: 'STRING' },
            { name: 'primary_opportunity_status', type: 'STRING' },
            { name: 'primary_opportunity_user_id', type: 'STRING' },
            { name: 'status_id', type: 'STRING' },
            { name: 'active_opportunity_value_summary', type: 'STRING' },
            { name: 'contacts_summary', type: 'STRING' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'description', type: 'STRING' },
            { name: 'display_name', type: 'STRING' },
            { name: 'first_call_created', type: 'TIMESTAMP' },
            { name: 'first_call_note', type: 'STRING' },
            { name: 'first_communication_date', type: 'TIMESTAMP' },
            { name: 'first_communication_summary', type: 'STRING' },
            { name: 'first_communication_type', type: 'STRING' },
            { name: 'first_source', type: 'STRING' },
            { name: 'html_url', type: 'STRING' },
            { name: 'last_activity_date', type: 'TIMESTAMP' },
            { name: 'last_activity_type', type: 'STRING' },
            { name: 'last_call_created', type: 'TIMESTAMP' },
            { name: 'last_call_duration', type: 'NUMERIC' },
            { name: 'last_call_note', type: 'STRING' },
            { name: 'last_communication_date', type: 'TIMESTAMP' },
            { name: 'last_communication_summary', type: 'STRING' },
            { name: 'last_communication_type', type: 'STRING' },
            { name: 'last_email_date', type: 'TIMESTAMP' },
            { name: 'last_email_subject', type: 'STRING' },
            { name: 'last_incoming_email_date', type: 'TIMESTAMP' },
            { name: 'last_lead_status_change_date', type: 'TIMESTAMP' },
            { name: 'last_note_created', type: 'TIMESTAMP' },
            { name: 'last_outgoing_call_date', type: 'TIMESTAMP' },
            { name: 'localtime', type: 'TIMESTAMP' },
            { name: 'name', type: 'STRING' },
            { name: 'next_task_date', type: 'TIMESTAMP' },
            { name: 'next_task_due_date', type: 'TIMESTAMP' },
            { name: 'next_task_text', type: 'STRING' },
            {
                name: 'primary_email',
                type: 'RECORD',
                fields: [
                    { name: 'email', type: 'STRING' },
                    { name: 'type', type: 'STRING' },
                ],
            },
            {
                name: 'primary_phone',
                type: 'RECORD',
                fields: [
                    { name: 'phone_formatted', type: 'STRING' },
                    { name: 'phone', type: 'STRING' },
                    { name: 'type', type: 'STRING' },
                    { name: 'country', type: 'STRING' },
                ],
            },
            { name: 'times_communicated', type: 'NUMERIC' },
            { name: 'url', type: 'STRING' },
            { name: 'won_opportunity_value_summary', type: 'STRING' },
            {
                name: 'custom',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'id', type: 'STRING' },
                    { name: 'value', type: 'STRING' },
                ],
            },
        ],
        writeDisposition: 'WRITE_APPEND',
        partitionField: 'date_created',
    },
};

export const Opportunity: Pipeline = {
    name: 'Opportunity',
    getExtractStream: getIncrementalStream({
        uri: 'opportunity',
        paramsBuilder: ({ start, end }) => ({
            _fields: [
                'id',
                'created_by',
                'contact_id',
                'lead_id',
                'status_id',
                'updated_by',
                'user_id',
                'annualized_expected_value',
                'annualized_value',
                'confidence',
                'date_created',
                'date_lost',
                'date_updated',
                'date_won',
                'expected_value',
                'integration_links',
                'note',
                'organization_id',
                'status_display_name',
                'value',
                'value_currency',
                'value_formatted',
                'value_period',
                'custom',
            ],
            _order_by: 'date_updated',
            query: `sort:updated date_updated >= ${start} date_updated <= ${end}`,
        }),
    }),
    transforms: [
        transformCustomFields(),
        transformValidation(
            Joi.object({
                id: Joi.string(),
                created_by: Joi.string(),
                contact_id: Joi.string(),
                lead_id: Joi.string(),
                status_id: Joi.string(),
                updated_by: Joi.string(),
                user_id: Joi.string(),
                annualized_expected_value: Joi.number(),
                annualized_value: Joi.number(),
                confidence: Joi.number(),
                date_created: timestamp,
                date_lost: timestamp,
                date_updated: timestamp,
                date_won: timestamp,
                expected_value: Joi.number(),
                integration_links: Joi.array().items({
                    name: Joi.string(),
                    url: Joi.string(),
                }),
                note: Joi.string(),
                organization_id: Joi.string(),
                status_display_name: Joi.string(),
                value: Joi.number(),
                value_currency: Joi.string(),
                value_formatted: Joi.string(),
                value_period: Joi.string(),
                custom: Joi.array().items({
                    id: Joi.string(),
                    value: Joi.string(),
                }),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: 'id', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'contact_id', type: 'STRING' },
            { name: 'lead_id', type: 'STRING' },
            { name: 'status_id', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
            { name: 'user_id', type: 'STRING' },
            { name: 'annualized_expected_value', type: 'NUMERIC' },
            { name: 'annualized_value', type: 'NUMERIC' },
            { name: 'confidence', type: 'NUMERIC' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'date_lost', type: 'TIMESTAMP' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'date_won', type: 'TIMESTAMP' },
            { name: 'expected_value', type: 'NUMERIC' },
            {
                name: 'integration_links',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'name', type: 'STRING' },
                    { name: 'url', type: 'STRING' },
                ],
            },
            { name: 'note', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'status_display_name', type: 'STRING' },
            { name: 'value', type: 'NUMERIC' },
            { name: 'value_currency', type: 'STRING' },
            { name: 'value_formatted', type: 'STRING' },
            { name: 'value_period', type: 'STRING' },
            {
                name: 'custom',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'id', type: 'STRING' },
                    { name: 'value', type: 'STRING' },
                ],
            },
        ],
        writeDisposition: 'WRITE_APPEND',
        partitionField: 'date_created',
    },
};

export const ActivityCustom: Pipeline = {
    name: 'ActivityCustom',
    getExtractStream: getIncrementalStream({
        uri: 'activity/custom',
        paramsBuilder: ({ start, end }) => ({
            _fields: [
                '_type',
                'activity_at',
                'contact_id',
                'created_by_name',
                'created_by',
                'custom_activity_type_id',
                'date_created',
                'date_updated',
                'id',
                'lead_id',
                'organization_id',
                'status',
                'updated_by_name',
                'updated_by',
                'user_id',
                'user_name',
                'custom',
            ],
            date_created__gt: start,
            date_created__lt: end,
        }),
    }),
    transforms: [
        transformCustomFields(),
        transformValidation(
            Joi.object({
                _type: Joi.string(),
                activity_at: timestamp,
                contact_id: Joi.string(),
                created_by_name: Joi.string(),
                created_by: Joi.string(),
                custom_activity_type_id: Joi.string(),
                date_created: timestamp,
                date_updated: timestamp,
                id: Joi.string(),
                lead_id: Joi.string(),
                organization_id: Joi.string(),
                status: Joi.string(),
                updated_by_name: Joi.string(),
                updated_by: Joi.string(),
                user_id: Joi.string(),
                user_name: Joi.string(),
                custom: Joi.array().items({
                    id: Joi.string(),
                    value: Joi.string(),
                }),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: '_type', type: 'STRING' },
            { name: 'activity_at', type: 'TIMESTAMP' },
            { name: 'contact_id', type: 'STRING' },
            { name: 'created_by_name', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'custom_activity_type_id', type: 'STRING' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'id', type: 'STRING' },
            { name: 'lead_id', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'status', type: 'STRING' },
            { name: 'updated_by_name', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
            { name: 'user_id', type: 'STRING' },
            { name: 'user_name', type: 'STRING' },
            {
                name: 'custom',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'id', type: 'STRING' },
                    { name: 'value', type: 'STRING' },
                ],
            },
        ],
        writeDisposition: 'WRITE_APPEND',
        partitionField: 'date_created',
    },
};

export const ActivityCall: Pipeline = {
    name: 'ActivityCall',
    getExtractStream: getIncrementalStream({
        uri: 'activity/call',
        paramsBuilder: ({ start, end }) => ({
            _fields: [
                '_type',
                'activity_at',
                'call_method',
                'contact_id',
                'cost',
                'created_by_name',
                'created_by',
                'date_answered',
                'date_created',
                'date_updated',
                'dialer_id',
                'dialer_saved_search_id',
                'direction',
                'disposition',
                'duration',
                'forwarded_to',
                'has_recording',
                'id',
                'is_forwarded',
                'is_joinable',
                'is_to_group_number',
                'lead_id',
                'local_country_iso',
                'local_phone_formatted',
                'local_phone',
                'note_html',
                'note',
                'organization_id',
                'phone',
                'recording_duration',
                'recording_expires_at',
                'recording_url',
                'remote_country_iso',
                'remote_phone_formatted',
                'remote_phone',
                'sequence_id',
                'sequence_name',
                'sequence_subscription_id',
                'source',
                'status',
                'transferred_from_user_id',
                'transferred_from',
                'transferred_to_user_id',
                'transferred_to',
                'updated_by_name',
                'updated_by',
                'user_id',
                'user_name',
                'voicemail_duration',
                'voicemail_url',
            ],
            date_created__gt: start,
            date_created__lt: end,
        }),
    }),
    transforms: [
        transformValidation(
            Joi.object({
                _type: Joi.string(),
                activity_at: timestamp,
                call_method: Joi.string(),
                contact_id: Joi.string(),
                cost: Joi.string(),
                created_by_name: Joi.string(),
                created_by: Joi.string(),
                date_answered: timestamp,
                date_created: timestamp,
                date_updated: timestamp,
                dialer_id: Joi.string(),
                dialer_saved_search_id: Joi.string(),
                direction: Joi.string(),
                disposition: Joi.string(),
                duration: Joi.number(),
                forwarded_to: Joi.string(),
                has_recording: Joi.boolean(),
                id: Joi.string(),
                is_forwarded: Joi.boolean(),
                is_joinable: Joi.boolean(),
                is_to_group_number: Joi.boolean(),
                lead_id: Joi.string(),
                local_country_iso: Joi.string(),
                local_phone_formatted: Joi.string(),
                local_phone: Joi.string(),
                note_html: Joi.string(),
                note: Joi.string(),
                organization_id: Joi.string(),
                phone: Joi.string(),
                recording_duration: Joi.number(),
                recording_expires_at: timestamp,
                recording_url: Joi.string(),
                remote_country_iso: Joi.string(),
                remote_phone_formatted: Joi.string(),
                remote_phone: Joi.string(),
                sequence_id: Joi.string(),
                sequence_name: Joi.string(),
                sequence_subscription_id: Joi.string(),
                source: Joi.string(),
                status: Joi.string(),
                transferred_from_user_id: Joi.string(),
                transferred_from: Joi.string(),
                transferred_to_user_id: Joi.string(),
                transferred_to: Joi.string(),
                updated_by_name: Joi.string(),
                updated_by: Joi.string(),
                user_id: Joi.string(),
                user_name: Joi.string(),
                voicemail_duration: Joi.number(),
                voicemail_url: Joi.string(),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: '_type', type: 'STRING' },
            { name: 'activity_at', type: 'TIMESTAMP' },
            { name: 'call_method', type: 'STRING' },
            { name: 'contact_id', type: 'STRING' },
            { name: 'cost', type: 'STRING' },
            { name: 'created_by_name', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'date_answered', type: 'TIMESTAMP' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'dialer_id', type: 'STRING' },
            { name: 'dialer_saved_search_id', type: 'STRING' },
            { name: 'direction', type: 'STRING' },
            { name: 'disposition', type: 'STRING' },
            { name: 'duration', type: 'NUMERIC' },
            { name: 'forwarded_to', type: 'STRING' },
            { name: 'has_recording', type: 'BOOLEAN' },
            { name: 'id', type: 'STRING' },
            { name: 'is_forwarded', type: 'BOOLEAN' },
            { name: 'is_joinable', type: 'BOOLEAN' },
            { name: 'is_to_group_number', type: 'BOOLEAN' },
            { name: 'lead_id', type: 'STRING' },
            { name: 'local_country_iso', type: 'STRING' },
            { name: 'local_phone_formatted', type: 'STRING' },
            { name: 'local_phone', type: 'STRING' },
            { name: 'note_html', type: 'STRING' },
            { name: 'note', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'phone', type: 'STRING' },
            { name: 'recording_duration', type: 'NUMERIC' },
            { name: 'recording_expires_at', type: 'TIMESTAMP' },
            { name: 'recording_url', type: 'STRING' },
            { name: 'remote_country_iso', type: 'STRING' },
            { name: 'remote_phone_formatted', type: 'STRING' },
            { name: 'remote_phone', type: 'STRING' },
            { name: 'sequence_id', type: 'STRING' },
            { name: 'sequence_name', type: 'STRING' },
            { name: 'sequence_subscription_id', type: 'STRING' },
            { name: 'source', type: 'STRING' },
            { name: 'status', type: 'STRING' },
            { name: 'transferred_from_user_id', type: 'STRING' },
            { name: 'transferred_from', type: 'STRING' },
            { name: 'transferred_to_user_id', type: 'STRING' },
            { name: 'transferred_to', type: 'STRING' },
            { name: 'updated_by_name', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
            { name: 'user_id', type: 'STRING' },
            { name: 'user_name', type: 'STRING' },
            { name: 'voicemail_duration', type: 'NUMERIC' },
            { name: 'voicemail_url', type: 'STRING' },
        ],
        writeDisposition: 'WRITE_APPEND',
        partitionField: 'date_created',
    },
};

export const CustomActivity: Pipeline = {
    name: 'CustomActivity',
    getExtractStream: getDimensionStream({ uri: 'custom_activity' }),
    transforms: [
        transformValidation(
            Joi.object({
                api_create_only: Joi.boolean(),
                created_by: Joi.string(),
                date_created: timestamp,
                date_updated: timestamp,
                description: Joi.string(),
                fields: Joi.array().items({
                    accepts_multiple_values: Joi.boolean(),
                    back_reference_is_visible: Joi.boolean(),
                    id: Joi.string(),
                    is_shared: Joi.boolean(),
                    name: Joi.string(),
                    referenced_custom_type_id: Joi.string(),
                    required: Joi.boolean(),
                    type: Joi.string(),
                }),
                id: Joi.string(),
                name: Joi.string(),
                organization_id: Joi.string(),
                updated_by: Joi.string(),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: 'api_create_only', type: 'BOOLEAN' },
            { name: 'created_by', type: 'STRING' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'description', type: 'STRING' },
            {
                name: 'fields',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'accepts_multiple_values', type: 'BOOLEAN' },
                    { name: 'back_reference_is_visible', type: 'BOOLEAN' },
                    { name: 'id', type: 'STRING' },
                    { name: 'is_shared', type: 'BOOLEAN' },
                    { name: 'name', type: 'STRING' },
                    { name: 'referenced_custom_type_id', type: 'STRING' },
                    { name: 'required', type: 'BOOLEAN' },
                    { name: 'type', type: 'STRING' },
                ],
            },
            { name: 'id', type: 'STRING' },
            { name: 'name', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
        ],
        writeDisposition: 'WRITE_TRUNCATE',
    },
};

export const LeadCustomField: Pipeline = {
    name: 'LeadCustomField',
    getExtractStream: getDimensionStream({ uri: 'custom_field/lead' }),
    transforms: [
        transformValidation(
            Joi.object({
                referenced_custom_type_id: Joi.string(),
                description: Joi.string(),
                accepts_multiple_values: Joi.boolean(),
                is_shared: Joi.boolean(),
                id: Joi.string(),
                created_by: Joi.string(),
                organization_id: Joi.string(),
                name: Joi.string(),
                date_updated: timestamp,
                date_created: timestamp,
                choices: Joi.array().items(Joi.string()),
                type: Joi.string(),
                updated_by: Joi.string(),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: 'referenced_custom_type_id', type: 'STRING' },
            { name: 'description', type: 'STRING' },
            { name: 'accepts_multiple_values', type: 'BOOLEAN' },
            { name: 'is_shared', type: 'BOOLEAN' },
            { name: 'id', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'name', type: 'STRING' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'choices', type: 'STRING', mode: 'REPEATED' },
            { name: 'type', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
        ],
        writeDisposition: 'WRITE_TRUNCATE',
    },
};

export const OpportunityCustomField: Pipeline = {
    name: 'OpportunityCustomField',
    getExtractStream: getDimensionStream({ uri: 'custom_field/opportunity' }),
    transforms: [
        transformValidation(
            Joi.object({
                referenced_custom_type_id: Joi.string(),
                description: Joi.string(),
                accepts_multiple_values: Joi.boolean(),
                is_shared: Joi.boolean(),
                id: Joi.string(),
                created_by: Joi.string(),
                organization_id: Joi.string(),
                name: Joi.string(),
                date_updated: timestamp,
                date_created: timestamp,
                choices: Joi.array().items(Joi.string()),
                type: Joi.string(),
                updated_by: Joi.string(),
            }),
        ),
    ],
    loadConfig: {
        schema: [
            { name: 'referenced_custom_type_id', type: 'STRING' },
            { name: 'description', type: 'STRING' },
            { name: 'accepts_multiple_values', type: 'BOOLEAN' },
            { name: 'is_shared', type: 'BOOLEAN' },
            { name: 'id', type: 'STRING' },
            { name: 'created_by', type: 'STRING' },
            { name: 'organization_id', type: 'STRING' },
            { name: 'name', type: 'STRING' },
            { name: 'date_updated', type: 'TIMESTAMP' },
            { name: 'date_created', type: 'TIMESTAMP' },
            { name: 'choices', type: 'STRING', mode: 'REPEATED' },
            { name: 'type', type: 'STRING' },
            { name: 'updated_by', type: 'STRING' },
        ],
        writeDisposition: 'WRITE_TRUNCATE',
    },
};
