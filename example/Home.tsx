import { default as React, MouseEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ContainerActions, mapActions } from "../src/actions";
import { ProcessType } from "../src/process";
import { Task } from "./apis/tasks";
import { TaskActions, TaskModule } from "./modules/task";
import { createTask, toggleTask } from "./processes/tasks";
import { RootState } from "./state";

export interface HomePageProps {
  taskActions?: ContainerActions<TaskActions>,
  tasks?: Task[],
  createTask?: ProcessType<typeof createTask>
  toggleTask?: ProcessType<typeof toggleTask>
}

class HomeContainer extends React.Component<HomePageProps> {
  state = { taskName: '' };

  render() {
    const { taskName } = this.state;
    return <div className="container">
      <div className="creation">
        <input type="text" value={ taskName } onChange={ this.changeTaskName }/>
        <button onClick={ this.createTask }>Create</button>
      </div>
      <div>{ this.props.tasks!.map(task => <div>
        <input type="checkbox" checked={ task.done } onClick={this.toggleTask} value={task.id}/>
        <span>{ task.name }</span>
      </div>) }</div>
    </div>;
  }

  private changeTaskName = ({ target }: { target: HTMLInputElement }) => {
    this.setState({ taskName: target.value });
  };

  private createTask = () => {
    this.props.createTask!(this.state.taskName).then(() => this.setState({ taskName: '' }));
  };

  private toggleTask = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const id = Number.parseInt(target.value);
    this.props.toggleTask!(id, target.checked);
  }
}

const mapStateToProps = (state: RootState, props: HomePageProps) => {
  return {
    tasks: TaskModule.selector.getAllTasks(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    taskActions: mapActions(dispatch, TaskModule.actions),
    createTask: createTask(dispatch),
    toggleTask: toggleTask(dispatch)
  }
};

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
