import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchArticles } from './action';
import Item from './Item';
import './App.css';

class App extends Component {

  state = {
    topSearchLeft: null,
  }

  handleScroll() {
    if (this.props.isLoading) return;
    const scrollHeight = document.body.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    if (scrollHeight - scrollTop < clientHeight) {
      this.props.fetchArticles();
    }
  }

  updateTopSearchLeft() {
    this.setState({
      topSearchLeft: this.containerDom.offsetLeft + this.listContentDom.clientWidth + 10
    })
  }

  componentDidMount() {
    this.props.fetchArticles();
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.updateTopSearchLeft.bind(this));
    this.updateTopSearchLeft();
  }

  render() {
    const { topSearchLeft } = this.state;
    return (
      <div className="App" >
        <header className="page-header">
          <div>
            <span> 我是知乎的导航栏</span>
          </div>
        </header>
        <div className="search-container" ref={node => this.containerDom = node}>
          {
            topSearchLeft ?
              <div className="top-search"
                ref={node => this.containerDom = node}
                style={{ left: topSearchLeft }}>
                <div className="top-search-title">热搜标题</div>
                <div className="top-search-list">
                  <div className="top-search-item">
                    热搜列表1
                  </div>
                  <div className="top-search-item">
                    热搜列表2
                  </div>
                  <div className="top-search-item">
                    热搜列表3
                  </div>
                  <div className="top-search-item">
                    热搜列表4
                  </div>
                  <div className="top-search-item">
                    热搜列表5
                  </div>
                </div>
              </div>
              : null
          }
          <div className="list-content"
            ref={node => this.listContentDom = node}
          >
            {
              this.props.articles.map(article => <Item key={article.id} title={article.title} text={article.text} />)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      articles: state.articles,
      isLoading: state.isLoading,
    }
  }, {
    fetchArticles,
  }
)(App);
