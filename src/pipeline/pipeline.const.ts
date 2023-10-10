import { Transform } from 'node:stream';

import { CreateLoadStreamConfig } from '../bigquery.service';
import { getResourceStream } from '../close/close.service';
import { Joi, timestamp, transformCustomFields, transformValidation } from './transform.utils';

export type Pipeline = {
    name: string;
    getExtractStream: ReturnType<typeof getResourceStream>;
    transforms: Transform[];
    loadConfig: CreateLoadStreamConfig;
};

export const Lead: Pipeline = {
    name: 'Lead',
    getExtractStream: getResourceStream({
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
    },
};

export const Opportunity: Pipeline = {
    name: 'Opportunity',
    getExtractStream: getResourceStream({
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
    },
};
