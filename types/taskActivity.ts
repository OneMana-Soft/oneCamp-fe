type TaskActivityKey = {
    key: string;
};

export const taskActivityConst: Record<string, TaskActivityKey> = {
    "nameUpdate": {
        "key": "updatedTask",
    },
    "labelUpdate": {
        "key": "updatedTaskLabel",
    },
    "statusUpdate": {
        "key": "updatedTaskStatus",
    },
    "priorityUpdate": {
        "key": "updateTaskPriority",
    },
    "assigneeUpdate": {
        "key": "updateTaskAssignee",
    },
    "startDateUpdate": {
        "key": "updateTaskStartDate",
    },
    "endDateUpdate": {
        "key": "updatedTaskDueDate",
    },
    "descUpdate": {
        "key": "updatedTaskDesc",
    },
    "attachmentAdd": {
        "key": "addedTaskAttachment",
    },
    "attachmentRemove": {
        "key": "removedAttachment",
    },
    "subTaskAdd": {
        "key": "createSubTask",
    },
    "subTaskDelete": {
        "key": "deletedTaskSubTask",

    },
    "subTaskUnDelete": {
        "key": "unDeletedTaskSubTask",
    },
    "commentAdd": {
        "key": "addedCommentToTask",
    },
    "commentUpdate": {
        "key": "updatedTaskComment",
    },
    "commentDelete": {
        "key": "deletedTaskComment",
    },
    "taskDelete": {
        "key": "deletedTask",
    },
    "taskUnDelete": {
        "key": "unrelatedTask",
    },
    "taskCreate": {
        "key": "createTask",
    }
};
