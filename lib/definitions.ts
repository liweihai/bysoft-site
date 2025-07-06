export type Blog = {
    id: string;
    title: string;
    remark: string;
    content: string;
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
    state: number
};

export type Quota = {
    customer_id: string,
    endpoint_id: string,
    api_key: string,
    tokens_used: number,
    requests_used: number,
    rpm: number,
    rpd: number,
    tpm: number,
    tpd: number,
}

export type Customer = {
    id: string,
    name: string,
    avatar: string,
    mobile:string,
    role: number,
    state: number
}

