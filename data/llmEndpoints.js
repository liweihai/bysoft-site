const llmEndpoints = [
    {
        api_type: 'gemini',
        base_url: 'https://gemini.bysoft.site/v1',
        api_key: 'AIzaSyBcQldMTwrrz1GroR9gPJFhtSTFcw6uKMs',
        model: 'gemini-2.0-flash'
    },

    {
        api_type: 'openrouter',
        base_url: 'https://openrouter.ai/api/v1/',
        api_key: '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',
        model: 'deepseek/deepseek-chat:free'
    },

    {
        api_type: 'bigmodel',
        base_url: "https://open.bigmodel.cn/api/paas/v4",
        api_key: 'a0aa672533c1697ccbbb65d503bdd161.h2O3RatTJNl48a4k',
        mpdel: 'glm-4-flash-250414'
    }
]

module.exports = llmEndpoints