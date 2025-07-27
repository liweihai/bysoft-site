
import EditForm from '@/components/cooperation/EditForm';
import { Suspense } from 'react'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata | undefined> {
    return {
        title: "联系我们",
        description: "联系我们",
    }
}

export default async function ContactUsPage() {
    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                联系我们
                </h1>
            </div>
            <EditForm />
        </div>
    );
}
