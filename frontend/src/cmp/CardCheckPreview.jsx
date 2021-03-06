import { BsCheckBox } from 'react-icons/bs';

export function CardCheckPreview({ checklists }) {

    function countTasks() {
        const tasksDisplay = checklists.reduce((acc, checklist) => {
            acc['taskCount'] += checklist.tasks.length
            checklist.tasks.forEach(task => {
                if (task.isDone) acc['taskCountDone']++
            })
            return acc;
        }, { taskCount: 0, taskCountDone: 0 })
        return tasksDisplay
    }

    const { taskCount, taskCountDone } = countTasks();
    const isDoneLabel = taskCount === taskCountDone ? 'done' : '';
    return (
        <div className={`badge flex align-center ${isDoneLabel}`}>
            <span className={`badge-icon checkbox flex align-center  ${isDoneLabel}`} ><BsCheckBox className="card-icon"/></span>
            <span className="card-txt"> {taskCountDone + '/' + taskCount} </span>
        </div>
    )

}