import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export interface IAIResponse {
  choices: {message: {content: string}}[];
}

export const holidaysApi = createApi({
  reducerPath: 'holidaysApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.groq.com/openai/v1/',
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_REACT_APP_GROQ_API_KEY}`);
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  endpoints: builder => ({
    getDayHolidaysInfo: builder.query<IAIResponse, string | undefined>({
      query: (date: string | undefined) => ({
        url: 'chat/completions',
        method: 'POST',
        body: {
          // model: 'openai/gpt-oss-20b',
          model: 'openai/gpt-oss-120b',
          // temperature uses for randomness of the model response (where 0 is maximally deterministic)
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `
Provide structured information about the requested date.

Rules:
- Return holidays for the date.
- Return exactly ONE interesting historical fact.
- The fact must be the most historically significant or widely known fact about that date.
- The fact MUST NOT include or reference Russia, the Russian Federation, the Soviet Union, or any events related to these countries.
- If the most significant fact is related to Russia or the Soviet Union, choose the next most significant fact that is unrelated to them.
- Do not return multiple facts.

Follow the provided JSON schema strictly.
`,
            },
            {
              role: 'user',
              content: `Get holidays and the most significant historical fact for ${date}`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'day_info',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  holidays: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {type: 'string'},
                        description: {type: 'string'},
                      },
                      required: ['name', 'description'],
                      additionalProperties: false,
                    },
                  },
                  fact: {
                    type: 'string',
                    description: 'The single most significant historical fact for this date',
                  },
                },
                required: ['holidays', 'fact'],
                additionalProperties: false,
              },
            },
          },
        },
      }),
      keepUnusedDataFor: 86400, // 24h cache
    }),
  }),
});

export const {useGetDayHolidaysInfoQuery} = holidaysApi;
