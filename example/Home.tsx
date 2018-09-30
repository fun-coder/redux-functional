import { default as React, MouseEvent } from "react";
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { Task } from './apis/tasks';
import { deleteTasks, TaskModule } from './modules/task';
import { createTask, toggleTask } from './processes/tasks';
import { RootState } from './state';

export interface HomePageProps {
  tasks: Task[],
  createTask: (name: string) => Promise<any>
  toggleTask: (id: number, done?: boolean) => Promise<any>
  deleteTask: (...ids: number[]) => Promise<any>
}


class HomeContainer extends React.Component<HomePageProps, any> {
  static defaultProps = {
    tasks: [],
    createTask: () => Promise.resolve(null),
    toggleTask: () => Promise.resolve(null),
    deleteTask: () => Promise.resolve(null)
  };

  state = { taskName: '', error: null };

  render() {
    const { taskName } = this.state;
    return <div className="container">
      <div className="creation">
        <input type="text" value={ taskName } onChange={ this.changeTaskName }/>
        <button onClick={ this.createTask }>Create</button>
      </div>
      <div>{ this.props.tasks!.map(task => <div key={ task.id }>
        <input type="checkbox" checked={ task.done } onClick={ this.toggleTask } value={ task.id }/>
        <span>{ task.name }</span>
        <button onClick={ () => this.props.deleteTask(task.id) }>x</button>
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

const mapDispatchToProps = <T extends Action>(dispatch: Dispatch): any => {
  return {
    createTask: createTask(dispatch),
    toggleTask: toggleTask(dispatch),
    deleteTask: deleteTasks(dispatch),
  }
};

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
