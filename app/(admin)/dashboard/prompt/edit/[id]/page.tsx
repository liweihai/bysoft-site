import {getModel, findModels} from "@/lib/data"
import {Prompt} from "@/lib/definitions"
import EditForm from '@/components/prompt/EditForm';
import {auth} from '@/auth';

async function EditPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const id = params.id

    const prompt = await getModel<Prompt>("Article", id)

    const session = await auth()

    prompt.customer_id = prompt.customer_id || session.user.id
    prompt.state = 0

    return (
        <div className="mx-auto p-4">
            <EditForm obj={prompt} />
        </div>
    )
}

export default EditPage