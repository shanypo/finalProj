import React from 'react';
import { connect } from 'react-redux';
import { loadBoard } from '../store/board.actions.js';
import { ProgressbarDone } from '../cmp/DashBoard/ProgressbarDone';
import { PieTasksPerLabel } from '../cmp/DashBoard/PieTasksPerLabel';
import { BarTaskPerMember } from '../cmp/DashBoard/BarTaskPerMember.jsx';
import { BarTaskPerList } from '../cmp/DashBoard/BarTaskPerList.jsx';
import { DashboardTitle } from '../cmp/DashBoard/DashboardTitle';
import { LineTasksPerDate } from '../cmp/DashBoard/LineTasksPerDate.jsx';
import { defaults } from 'react-chartjs-2';
import close from '../assets/imgs/close.svg';

class _Dashboard extends React.Component {

    componentDidMount() {
        defaults.font.size = 16
        defaults.color = '#fff'
        defaults.plugins.legend.display = false
    }

    goBack = () => {
        const { board } = this.props
        this.props.history.push(`/boards/${board._id}`);
    }
    render() {
        const { board } = this.props
        const allCards = board.lists.filter(list => list.cards.length !== 0)
        if (!board.lists.length || !allCards.length) return (
            <div className="dashboard-wrapper" >
                <div className="screen-dashboard"></div>
                <section className="dashboard">
                    <div className="close-window-btn pointer flex align-center justify-center" onClick={this.goBack}><img src={close} alt="close" /></div>
                    <h1 className="no-data">
                        No data to show... <br />Try adding tasks to your board
                    </h1>
                </section>
            </div>
        )
        return (
            <div className="dashboard-wrapper" >
                <div className="screen-dashboard"></div>
                <section className="dashboard">
                    <div className="close-window-btn pointer flex align-center justify-center" onClick={this.goBack}><img src={close} alt="close" /></div>
                    <DashboardTitle board={board} />
                    <div className="charts-container">
                        <BarTaskPerMember board={board} />
                        <PieTasksPerLabel board={board} />
                        <ProgressbarDone board={board} />
                        <LineTasksPerDate board={board} />
                        <BarTaskPerList board={board} />
                    </div>
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardReducer.board,
    }
}
const mapDispatchToProps = {
    loadBoard,
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)
