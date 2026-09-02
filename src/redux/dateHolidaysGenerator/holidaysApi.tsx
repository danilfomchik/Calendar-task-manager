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
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `
Provide structured information about the requested date.

Rules:
- Return exactly ONE holiday for the date.
- The holiday must be the most significant or widely recognized one for that date.
- The holiday MUST NOT include or reference Russia, the Russian Federation, the Soviet Union, or any events related to these countries.
- If the most significant holiday is related to Russia or the Soviet Union, choose the next most significant holiday that is unrelated to them.
- Prefer holidays that are internationally recognized or celebrated in multiple countries rather than niche or local observances.
- Do not return multiple holidays.

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
              content: `Get the most significant holiday and the most significant historical fact for ${date}`,
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
                  holiday: {
                    type: 'object',
                    properties: {
                      name: {type: 'string'},
                      description: {type: 'string'},
                    },
                    required: ['name', 'description'],
                    additionalProperties: false,
                  },
                  fact: {
                    type: 'string',
                    description: 'The single most significant historical fact for this date',
                  },
                },
                required: ['holiday', 'fact'],
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
