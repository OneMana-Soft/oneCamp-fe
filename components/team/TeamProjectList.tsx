import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {useFetch} from "@/hooks/useFetch";
import {TeamInfoInterface, TeamInfoRawInterface} from "@/types/team";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ProjectAddOrRemoveInterface, ProjectInfoInterface} from "@/types/project";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {usePost} from "@/hooks/usePost";
import {TeamProjectInfo} from "@/components/team/TeamProjectInfo";
import {openUI} from "@/store/slice/uiSlice";

export const TeamProjectList = ({teamId}:{teamId: string}) => {


    const dispatch = useDispatch()
    const post = usePost()
    const teamProjectList = useFetch<TeamInfoRawInterface>(teamId ? GetEndpointUrl.GetTeamProjectList + '/' + teamId :'')

    const handleProjectMembers = (id: string) => {
        dispatch(openUI({ key: 'editProjectMember', data: {projectUUID: id} }))
    }

    const [query, setQuery] = useState('')

    const execDelete = (id: string) => {
        post.makeRequest<ProjectAddOrRemoveInterface>({
            apiEndpoint: PostEndpointUrl.DeleteProject,
            payload: {
                project_uuid: id
            }
        }).then(()=>{
            teamProjectList.mutate()
        })
    }

    const handleDelete = (id: string) => {
        if(!id) return

        setTimeout(() => {
            dispatch(openUI({
                key: 'confirmAlert',
                data: {
                    title: "Archiving project",
                    description: "Are you sure you want to proceed archiving the project",
                    confirmText: "Archive project",
                    onConfirm: ()=>{execDelete(id)}
                }
            }));
        }, 500);


    }

    const execUndelete = (id: string) => {
        post.makeRequest<ProjectAddOrRemoveInterface>({
            apiEndpoint: PostEndpointUrl.UndeleteProject,
            payload: {
                project_uuid: id
            }
        }).then(()=>{
            teamProjectList.mutate()
        })
    }

    const handleUnDelete = async (id: string) => {
        if(!id) return

        setTimeout(() => {
            dispatch(openUI({
                key: 'confirmAlert',
                data: {
                    title: "UnArchiving project",
                    description: "Are you sure you want to proceed unarchiving the project",
                    confirmText: "UnArchive project",
                    onConfirm: ()=>{execUndelete(id)}
                }
            }));
        }, 500);


    }


    const filteredProject =
        query === ''
            ? teamProjectList.data?.data.team_projects || [] as ProjectInfoInterface[]
            : teamProjectList.data?.data.team_projects?.filter((project) =>
            project.project_name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        ) || [] as ProjectInfoInterface[]


    return (

        <div className="h-full flex flex-col gap-y-4">
            <div className="flex-shrink-0">
                <Input
                    type="text"
                    placeholder={'project search...'}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-muted/30 border-border/50 focus-visible:ring-primary/20"
                />
            </div>

            <div className="flex-1 min-h-0 mt-2 channel-members-list flex flex-col overflow-y-auto pr-2">
                {filteredProject?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {"No project found"}
                    </div>
                ) : (filteredProject.map((project, i) => {


                    return (

                        <div key={(project.project_uuid)}>
                            <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                            <TeamProjectInfo projectInfo={project} handleDelete={handleDelete} handleUnDelete={handleUnDelete} isAdmin={teamProjectList.data?.data.team_is_admin||false} handleProjectMembers={handleProjectMembers}/>
                            <Separator orientation="horizontal" className="" />

                        </div>
                    )
                }))}
            </div>
        </div>

    );
}