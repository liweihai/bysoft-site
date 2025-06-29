import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm id={null} title={""} content={""} />
            </Suspense>
        </div>
    )
}

export default EditPage