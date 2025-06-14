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

export type Account = {
    username: string;
    customer_id: string;
    token: string;
};

