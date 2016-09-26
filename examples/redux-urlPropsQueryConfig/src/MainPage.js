import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { addUrlProps, QueryParamTypes } from 'react-url-query';
import { changeArr, changeBaz, changeFoo, changeBar } from './state/actions';

/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 *
 * The queryParam value for `foo` here matches the one used in the changeFoo
 * action.
 */
const urlPropsQueryConfig = {
  arr: { type: QueryParamTypes.array },
  bar: { type: QueryParamTypes.string },
  foo: { type: QueryParamTypes.number, queryParam: 'fooInUrl' },
}

/**
 * Standard react-redux mapStateToProps -- maps state from the Redux store to
 * the `baz` prop in MainPage. Used via the higher-order component `connect`.
 */
function mapStateToProps(state, props) {
  return {
    baz: state.baz,
  };
}

/**
 * The MainPage container. Note that none of the code within this component
 * indicates which values are stored in the URL and which are stored in the Redux
 * store.
 */
class MainPage extends PureComponent {
  static propTypes = {
    arr: PropTypes.array,
    bar: PropTypes.string,
    baz: PropTypes.string,
    foo: PropTypes.number,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    arr: [],
    bar: 'bar',
    baz: 'baz',
    foo: 123,
  }

  /**
   * Log whether or not we are getting a new array decoded for `arr` each time
   * we receive props. Ideally, this only happens when `arr` changes.
   *
   * We are using urlPropsQueryConfig, so the decoding is handled by addUrlProps
   * as opposed to mapUrlToProps. The decoding within addUrlProps only re-decodes
   * a value if it has changed, so we get the desired behavior.
   */
  componentWillReceiveProps(nextProps) {
    const { arr } = this.props;
    if (arr !== nextProps.arr) {
      console.log('got new arr:', arr, '->', nextProps.arr);
    } else {
      console.log('arr did not change:', arr, '===', nextProps.arr);
    }
  }

  onChangeArr(arr) {
    const { dispatch } = this.props;
    dispatch(changeArr(arr));
  }

  onChangeFoo(foo) {
    const { dispatch } = this.props;
    dispatch(changeFoo(foo));
  }

  onChangeBar(bar) {
    const { dispatch } = this.props;
    dispatch(changeBar(bar));
  }

  onChangeBaz(baz) {
    const { dispatch } = this.props;
    dispatch(changeBaz(baz));
  }

  render() {
    const { arr, foo, bar, baz } = this.props;

    return (
      <div>
        <ul>
          <li><b>arr: </b>{JSON.stringify(arr)} (url query param)</li>
          <li><b>foo: </b>{foo} (url query param)</li>
          <li><b>bar: </b>{bar} (url query param)</li>
          <li><b>baz: </b>{baz} (redux state)</li>
        </ul>
        <div>
          <button onClick={() => this.onChangeArr([Math.round(Math.random() * 9), Math.round(Math.random() * 9)])}>
            Change arr
          </button>
          <button onClick={() => this.onChangeFoo(Math.round(Math.random() * 1000))}>
            Change foo
          </button>
          <button onClick={() => this.onChangeBar(Math.random().toString(32).substring(8))}>
            Change bar
          </button>
          <button onClick={() => this.onChangeBaz(Math.random().toString(32).substring(10))}>
            Change baz
          </button>
        </div>
      </div>
    );
  }
}

/**
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for MainPage. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({ urlPropsQueryConfig })(connect(mapStateToProps)(MainPage));