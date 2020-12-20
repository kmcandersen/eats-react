import React, { Component, createRef } from 'react';
import ListItem from './ListItem';

class List extends Component {
  constructor(props) {
    super(props);
    this.resultsRef = createRef();
    this.state = {
      listHeight: 0,
    };
  }

  componentDidMount = () => {
    this.getListHeight();
    window.addEventListener('resize', () => {
      this.getListHeight();
    });
  };

  getListHeight = () => {
    // list must have a defined height for scroll
    let listHeight;
    // phone width
    if (window.innerWidth < 768) {
      listHeight = 380;
    } else {
      //header + search + station
      let elsHeight = 60 + 110 + 100;
      listHeight = window.innerHeight - elsHeight;
    }

    this.setState({
      listHeight: listHeight,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedRestId !== prevProps.selectedRestId) {
      let results = this.resultsRef.current.childNodes;
      for (let i = 0; i < results.length; i++) {
        if (
          results[i].attributes['data-id'].value ===
          this.props.selectedRestId &&
          //don't scrollIntoView if ListItem clicked (distracting)
          this.props.restSelectedOnMap
        ) {
          results[i].scrollIntoView(true);
          //   results[i].scrollIntoView({
          //     alignToTop: true,
          // behavior: "smooth",
          //block: "center",
          //});
          //find first match only
          break;
        }
      }
    }
  }

  render() {
    const {
      items,
      selectedRestId,
      selectRest,
      removeSelectedRest,
    } = this.props;
    return (
      <div
        className="List--wrapper"
        style={{ height: this.state.listHeight, overflow: 'scroll' }}
        ref={this.resultsRef}
      >
        {items.map(item => (
          <ListItem
            item={item}
            key={item.id}
            selectedRestId={selectedRestId}
            selectRest={selectRest}
            removeSelectedRest={removeSelectedRest}
          />
        ))}
      </div>
    );
  }
}

export default List;
