export function GetTaskStatusQueryParamByStatus({
                                                    getAll = false,
                                                    status = [],
                                                    priorityFilter = [],
                                                    projectFilter = [],
                                                    assigneeFilter = [],
                                                    pageSize = 0,
                                                    pageIndex = 0,
                                                    getOverdue = false,
                                                    getUpcoming = false,
                                                    searchText = '',
                                                }: {
    getAll?: boolean;
    status?: string[];
    priorityFilter?: string[];
    projectFilter?: string[];
    assigneeFilter?: string[];
    pageSize?: number;
    pageIndex?: number;
    getOverdue?: boolean;
    getUpcoming?: boolean;
    searchText?: string;
}): string {  const params = new URLSearchParams();
    const queryString = []

    if(status.length > 0 ){
        queryString.push({"id":"task_status","value":status})
    }

    if(priorityFilter.length > 0) {
        queryString.push({"id":"task_priority","value":priorityFilter})
    }
    if(projectFilter.length > 0) {
        queryString.push({"id":"task_project_name","value":projectFilter})
    }

    if(assigneeFilter.length > 0) {
        queryString.push({"id":"task_assignee_name","value":assigneeFilter})
    }

    if(getOverdue) {
        queryString.push({"id":"overdue","value":'task'})
    }

    if(getUpcoming) {
        queryString.push({"id":"upcoming","value":'task'})
    }

    if(pageSize) {
        params.set('pageSize', pageSize.toString());
        params.set('pageIndex', pageIndex.toString());
    }

    if(searchText) {
        params.set('searchText', searchText);
    }

    if(queryString.length > 0 ) {
        params.set('filters', JSON.stringify(queryString))

    }

    if(getAll) {
        params.set('getAll', JSON.stringify(true));
    }

    return params.toString();
}