export type Prompt = {
    id: string;
    customer_id: string;
    title: string;
    remark: string;
    content: string;
    content_type: number,
    category: string;
    keywords: string;
    publish: string;
    state: number;
    create_time: string;
    update_time: string;
};

export type Config = {
    id: string;
    name: string;
    value: string;
    create_time: string;
    update_time: string;
};

export type Account = {
    username: string;
    customer_id: string;
    token: string;
};

export type ServerError = {
    code: number;
    message: string;
};

export type Endpoint = {
    id: string,
    provider: string,
    site_url: string,
    base_url: string,
    model: string,
    description: string,
    rpm_threshold: number,
    rpd_threshold: number,
    tpm_threshold: number,
    tpd_threshold: number,
    free_tokens: number,
    modals: string,
    state: number
};

export type QuotaGroup = {
    id: string,
    customer_id: string,
    name: string,
    algorithm: string
};

export type Quota = {
    id: string,
    customer_id: string,
    quota_group_id: string,
    endpoint_id: string,
    api_key: string,
    tokens_used: number,
    requests_used: number,
    rpm: number,
    rpd: number,
    tpm: number,
    tpd: number,
    priority: number
}

export type ApiKey = {
    id: string,
    customer_id: string,
    api_key: string,
    create_time: string
}

export type Customer = {
    id: string,
    name: string,
    avatar: string,
    mobile:string,
    role: number,
    state: number
}

export type Cooperation = {
    id: string;
    name: string;
    phone: string;
    description: string;
    state: number;
    create_time: string;
};
