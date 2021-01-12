import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Tile(props) {
    const redText = { color: 'red', background: 'white', borderColor: 'gainsboro' };
    const greenText = { color: 'green', background: 'white', borderColor: 'gainsboro' };
    const blueText = { color: 'blue', background: 'white', borderColor: 'gainsboro' };
    const purpleText = { color: 'purple', background: 'white', borderColor: 'gainsboro' };
    const orangeText = { color: 'orange', background: 'white', borderColor: 'gainsboro' };
    const transparentText = { color: 'transparent', background: 'white', borderColor: 'gainsboro' };
    const cadetBlueText = { color: 'cadetBlue', background: 'white', borderColor: 'gainsboro' };
    const brownText = { color: 'brown', background: 'white', borderColor: 'gainsboro' };
    const deepPinkText = { color: 'deepPink', background: 'white', borderColor: 'gainsboro' };
    const mine = { color: 'crimson', background: 'black' };
    const flag = { color: 'lime', background: 'black' };
    const falseFlag = { color: 'orange', background: 'black' };

    switch (props.value) {
        case 0:
            return (
                <button style={transparentText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 1:
            return (
                <button style={blueText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 2:
            return (
                <button style={greenText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 3:
            return (
                <button style={brownText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 4:
            return (
                <button style={purpleText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 5:
            return (
                <button style={orangeText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 6:
            return (
                <button style={redText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 7:
            return (
                <button style={cadetBlueText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 8:
            return (
                <button style={deepPinkText} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        case 10:
            return (
                <button style={flag} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    F
                </button>
            );
        case -50:
            return (
                <button style={falseFlag} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    X
                </button>
            );
        case null:
            return (
                <button className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    {props.value}
                </button>
            );
        default:
            return (
                <button style={mine} className="tile" onClick={props.onClick} onContextMenu={props.onClick}>
                    M
                </button>
            );
    }
}

class Field extends React.Component {
    displayValue(value, isClicked, isFlagged) {
        if (this.props.isRevealed && isFlagged && (value >= 0)) {
            return -50;
        }
        if (isFlagged) {
            return 10;
        }
        if (isClicked) {
            return value;
        }
        return null;
    }

    renderTile(i) {
        return (
            <Tile
                value={this.displayValue(this.props.tiles[i], this.props.isClicked[i], this.props.isFlagged[i])}
                onClick={(event) => this.props.onClick(i, event)}
            />
        );
    }

    createRows(rowTotal, columnTotal) {
        const rows = [];
        for (let i = 0; i < rowTotal; i++) {
            rows[i] = <div className="field-row" key={i}> {this.createColumns(i, columnTotal)}</div>
        }
        return rows;
    }

    createColumns(i, columnTotal) {
        const columns = [];
        for (let j = 0; j < columnTotal; j++) {
            <div className="block" key={j}> {columns[j] = this.renderTile(j + i * columnTotal)}</div>
        }
        return columns;
    }

    render() {
        const rows = this.props.rows;
        const columns = this.props.columns;
        return (
            <div>
                {this.createRows(rows, columns)}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: placeMines(Array(this.props.rows * this.props.columns).fill(0), this.props.mines, this.props.rows, this.props.columns),
            isClicked: Array(this.props.rows * this.props.columns).fill(null),
            isFlagged: Array(this.props.rows * this.props.columns).fill(null),
            isFinished: null,
            flagging: false,
            tilesLeft: this.props.rows * this.props.columns,
            isRevealed: false,
        };
    }

    handleClick(i, event) {
        const tiles = this.state.tiles.slice();
        const isFlagging = this.state.flagging;
        let isClicked = this.state.isClicked.slice();
        let isFinished = this.state.isFinished;
        let isFlagged = this.state.isFlagged.slice();
        let tilesLeft = this.state.tilesLeft;

        //right click handler
        if (event.nativeEvent.which === 3) {
            event.preventDefault();

            if (isClicked[i] || isFinished) {
                return;
            }
            
            if(isFlagged[i])
            {
                isFlagged[i] = false;
            }
            else{
                isFlagged[i] = true;
            }
            this.setState({
                isFlagged: isFlagged,
            })
        }
        //left click handler
        else{
            if (isClicked[i] || isFinished) {
                return;
            }
            if (!isFlagging) {
                if (!isFlagged[i]) {
                    isClicked[i] = true;

                    //this code is used when the tile clicked has no mines near it, and automatically reveals the nearby tiles
                    if (tiles[i] === 0) {
                        isClicked = nearbyChecker(i, this.props.rows, this.props.columns, tiles, isClicked);
                    }

                    let clicked = 0;

                    for (let i = 0; i < isClicked.length; i++) {
                        if (isClicked[i]) {
                            clicked++;
                        }
                    }

                    tilesLeft = (this.props.rows * this.props.columns) - clicked;
                    //all non-mine tiles are revealed, game has been won
                    if (tilesLeft === this.props.mines) {
                        isFinished = 1;
                    }

                    //tiles[i] < 0 is the case where the user finds a mine, game is lost
                    if (tiles[i] < 0) {
                        isFinished = -1;
                    }

                    this.setState({
                        isClicked: isClicked,
                        isFinished: isFinished,
                        tilesLeft: tilesLeft,
                    });
                }
            }
            else {
                if (isFlagged[i]) {
                    isFlagged[i] = false;
                }
                else {
                    isFlagged[i] = true;
                }
                this.setState({
                    isFlagged: isFlagged,
                })
            }
        }
    }

    flagClick() {
        let isFlagging = this.state.flagging;
        if (!isFlagging) {
            isFlagging = true;
        }
        else {
            isFlagging = false;
        }
        this.setState({
            flagging: isFlagging,
        })
    }

    quickClick() {
        this.setState({
            tiles: placeMines(Array(this.props.rows * this.props.columns).fill(0), this.props.mines, this.props.rows, this.props.columns),
            isClicked: Array(this.props.rows * this.props.columns).fill(null),
            isFlagged: Array(this.props.rows * this.props.columns).fill(null),
            isFinished: null,
            flagging: false,
            tilesLeft: this.props.rows * this.props.columns,
            isRevealed: false,
        })
    }

    revealClick() {
        const tiles = this.state.tiles;
        let isClicked = this.state.isClicked.slice();

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] < 0) {
                isClicked[i] = true;
            }
        }
        this.setState({
            isClicked: isClicked,
            isFinished: -1,
            isRevealed: true,
        })
    }

    render() {
        const tiles = this.state.tiles;
        const isClicked = this.state.isClicked;
        const rows = this.props.rows;
        const columns = this.props.columns;
        const isFlagged = this.state.isFlagged;
        const isFlagging = this.state.flagging;
        const isFinished = this.state.isFinished;
        const tilesLeft = this.state.tilesLeft;
        const mines = this.props.mines;
        const isRevealed = this.state.isRevealed;

        let flagMessage = '';
        if (isFlagging) {
            flagMessage = "Flagging is [On]"
        }
        else {
            flagMessage = "Flagging is [Off]"
        }

        let statusMessage = '';
        let mineless = tilesLeft - mines;
        if (isFinished > 0) {
            statusMessage = "Only mines are left, You win.  Congratulations."
        }
        else if (isFinished < 0) {
            statusMessage = "You found a mine, You lost.  Better luck next time."
        }
        else {
            statusMessage = "The game is ongoing. " + mineless + " tiles are left without mines."
        }

        return (
            <div>
                {statusMessage}
                <Field
                    tiles={tiles}
                    isClicked={isClicked}
                    onClick={(i, event) => this.handleClick(i, event)}
                    rows={rows}
                    columns={columns}
                    isFlagged={isFlagged}
                    isRevealed={isRevealed}
                />
                <br></br>
                <div>{flagMessage}</div>
                <button onClick={() => { this.flagClick() }}> Flag Toggle </button>
                <br></br>
                <br></br>
                <button onClick={() => { this.revealClick() }}> Reveal Results </button>
                <br></br>
                <br></br>
                <div>Quick Remake will restart with the same board size and mine total.</div>
                <button onClick={() => { this.quickClick() }}> Quick Remake </button>
            </div>
        );
    }
}

class Initialize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitialized: null,
            rows: null,
            columns: null,
            mines: null,
            doubleCheck: false,
            quickRestart: false,
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: Number(value)
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let rows = this.state.rows;
        let columns = this.state.columns;
        let mines = this.state.mines;

        if (mines > (rows * columns)) {
            alert("cannot have more mines than tiles to put them on.");
        }
        else {
            this.setState({
                isInitialized: true,
            })
        }
    }

    restartClick() {
        this.setState({
            doubleCheck: true,
        })
    }

    confirmClick(response) {
        if (response) {
            this.setState({
                rows: null,
                columns: null,
                mines: null,
                isInitialized: false,
                doubleCheck: false,
            })

        }
        else {
            this.setState({
                doubleCheck: false,
            })
        }
    }

    render() {
        const isInitialized = this.state.isInitialized;
        const rows = this.state.rows;
        const columns = this.state.columns;
        const mines = this.state.mines;
        let restartButton;

        if (this.state.doubleCheck) {
            restartButton = <div>
                <div>Really Remake Game?</div>
                <button onClick={() => { this.confirmClick(true) }}> Yes </button>
                <button onClick={() => { this.confirmClick(false) }}> No </button>
            </div>
        }
        else {
            restartButton = <button onClick={() => { this.restartClick() }}> Remake Game </button>
        }
        if (isInitialized) {
            return (
                <div className="mineclearer">
                    <h1>Mineclearer</h1>
                    <Game
                        rows={rows}
                        columns={columns}
                        mines={mines}
                    />
                    <br></br>
                    <br></br>
                    {restartButton}
                    <br></br>
                </div>
            );
        }
        else {
            return (
                <form className="initializeForm" onSubmit={this.handleSubmit}>
                    <label>
                        Desired Rows:
                        <input type="number" name="rows" onChange={this.handleChange} min="1" max="50" required />
                        <br></br>
                    </label>
                    <label>
                        Desired Columns:
                        <input type="number" name="columns" onChange={this.handleChange} min="1" max="50" required />
                        <br></br>
                    </label>
                    <label>
                        Desired Mines:
                        <input type="number" name="mines" onChange={this.handleChange} min="1" required />
                        <br></br>
                    </label>
                    <input type="submit" />
                </form>
            );
        }
    }
}

ReactDOM.render(
    <Initialize />,
    document.getElementById('root')
);

function placeMines(tiles, mines, rows, columns) {
    let bottom = true;
    let top = true;
    let right = true;
    let left = true;
    const tileTotal = tiles.length;
    let tilesLeft = tiles.length;
    let minesLeft = mines;

    for (let i = 0; i < tileTotal; i++) {
        /*rolls a value between tiles left and mines left, sets the tile as a mine if the roll is less than or 
        equal to mines left.  Then increments the tilesLeft and mines left accordingly and updates the nearby 
        tiles to reflect the nearby mine's presence.*/
        if (((Math.floor(Math.random() * tilesLeft)) + 1) <= minesLeft) {
            left = true;
            right = true;
            top = true;
            bottom = true;

            tiles[i] = -20;
            minesLeft = minesLeft - 1;

            //this if statement is true if i is not on the left border
            if ((i % columns) !== 0) {
                left = false;
            }
            //this if statement is true if i is not on the right border
            if ((i % columns) !== (columns - 1)) {
                right = false;
            }
            //this if statement is true if i is not on the top border
            if (i >= columns) {
                top = false;
            }
            //this if statement is true if i is not on the bottom border
            if (i < ((rows * columns) - columns)) {
                bottom = false;
            }

            //checks nearby tiles to the left and increments them if they exist
            if (!left) {
                tiles[i - 1]++;
                if (!top) {
                    tiles[(i - 1) - columns]++;
                }
                if (!bottom) {
                    tiles[(i - 1) + columns]++;
                }
            }

            //checks nearby tiles to the right and increments them if they exist
            if (!right) {
                tiles[i + 1]++;
                if (!top) {
                    tiles[(i + 1) - columns]++;
                }
                if (!bottom) {
                    tiles[(i + 1) + columns]++;
                }
            }

            //checks the tile directly above and increments it if it exists
            if (!top) {
                tiles[i - columns]++;
            }

            //checks the tile directly below and increments it if it exists.
            if (!bottom) {
                tiles[i + columns]++;
            }
        }
        tilesLeft = tilesLeft - 1;
    }
    return tiles;
}

//checks nearby tiles from the game instance to reveal all tiles next to tiles without any mines nearby
function nearbyChecker(i, rows, columns, tiles, isClicked, recursionDepth) {
    let bottom = true;
    let top = true;
    let right = true;
    let left = true;
    let current = null;
    let nearby = [];

    //this section tracks recursion depth and limits it so as to not break on very large/sparse games
    if (!Number(recursionDepth)) {
        recursionDepth = 1;
    }
    else {
        recursionDepth++;
        if (recursionDepth >= 1000) {
            return isClicked;
        }
    }

    //this if statement is true if i is not on the left border
    if ((i % columns) !== 0) {
        left = false;
    }
    //this if statement is true if i is not on the right border
    if ((i % columns) !== (columns - 1)) {
        right = false;
    }
    //this if statement is true if i is not on the top border
    if (i >= columns) {
        top = false;
    }
    //this if statement is true if i is not on the bottom border
    if (i < ((rows * columns) - columns)) {
        bottom = false;
    }

    //checks nearby tiles to the left and updates it's clicked value and adds it to nearby to be iterated over
    current = i - 1;
    if (!left) {
        if (!isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
        current = (i - 1) - columns;
        if (!top && !isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
        current = (i - 1) + columns;
        if (!bottom && !isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
    }

    //checks nearby tiles to the right and updates it's clicked value and adds it to nearby to be iterated over
    current = i + 1;
    if (!right) {
        if (!isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
        current = (i + 1) - columns;
        if (!top && !isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
        current = (i + 1) + columns;
        if (!bottom && !isClicked[current]) {
            nearby.push(current);
            isClicked[current] = true;
        }
    }

    //checks the tile directly above, updates it's clicked value and adds it to nearby to be iterated over
    current = i - columns;
    if (!top && !isClicked[current]) {
        nearby.push(current);
        isClicked[current] = true;
    }

    //checks the tile directly below, updates it's clicked value and adds it to nearby to be iterated over
    current = i + columns;
    if (!bottom && !isClicked[current]) {
        nearby.push(current);
        isClicked[current] = true;
    }

    for (let i = 0; i < nearby.length; i++) {
        if (tiles[nearby[i]] === 0) {
            isClicked = nearbyChecker(nearby[i], rows, columns, tiles, isClicked, recursionDepth);
        }
    }
    return isClicked;
}
