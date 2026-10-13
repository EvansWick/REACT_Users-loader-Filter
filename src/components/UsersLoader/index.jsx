import { Component } from "react";

import queryString from "query-string";
import styles from "./UsersLoader.module.sass";
import UserItem from "./UserItem";
import InputFields from "./InputFields";
import classNames from "classnames";

const CONFIGS = {
  BASE_URL: "https://randomuser.me/api/",
  RESULTS_ORDER: "pe2022",
  RESULTS_COUNT: 40,
  INCLUDUNG_RESULTS: [
    "name",
    "gender",
    "email",
    "login",
    "picture",
    "id",
    "dob",
  ],
};

export default class UsersLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      isFetching: false,
      error: null,
      currentPage: 1,

      showLogin: false,
      showEmail: false,

      filterSettings: {},
    };
  }

  loadUsers = (gender = "all", userCount = 20) => {
    const { currentPage } = this.state;

    this.setState({ isFetching: true });

    const getUsersCongig = {
      page: currentPage,
      results: userCount,
      gender: gender,
    };

    this.getUsers(getUsersCongig)
      .then((data) => {
        // console.log("getusers data", data);
        return this.setState({ users: data });
      })
      .catch((e) => this.setState({ error: e }))
      .finally(() => this.setState({ isFetching: false }));
  };

  setFilter = (config) => {
    console.log("filter config", config);
    this.setState({ filterSettings: { ...config } });
    this.loadUsers();
    // В стані є обєкт параметрів фільтру і якщо він не пустий, то гетюзерс повертає з урахуванням
    // фільтруванння
  };

  // При збільшенні параметрів фільтрів, функцію можна дописати
  applyFilter(usersArr) {
    if (Object.keys(this.state.filterSettings).length > 0) {
      const { gender, ageBefore, ageAfter } = this.state.filterSettings;
      const newUsersArr = usersArr.filter((u) => {
        return gender !== "all"
          ? gender === u.gender &&
              ageAfter <= u.dob.age &&
              u.dob.age <= ageBefore
          : ageAfter <= u.dob.age && u.dob.age <= ageBefore;
      });
      return newUsersArr;
    }

    return usersArr;
  }

  setUserView = (config) => {
    console.log("user config", config);
    this.setState({ showLogin: config.showLogin, showEmail: config.showEmail });
  };

  getUsers = (options) => {
    const defaultOptions = {
      page: 1,

      results: CONFIGS.RESULTS_COUNT,
      seed: CONFIGS.RESULTS_ORDER,
      inc: CONFIGS.INCLUDUNG_RESULTS,
    };

    const realOptions = {
      ...defaultOptions,
      ...options,
    };

    const queryStringifiedOptions = queryString.stringify(realOptions, {
      arrayFormat: "comma",
    });

    return fetch(`${CONFIGS.BASE_URL}?${queryStringifiedOptions}`)
      .then((response) => response.json())
      .then((data) => this.applyFilter(data.results));
  };

  componentDidMount() {
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;

    if (currentPage !== prevState.currentPage) {
      this.loadUsers();
    }
  }

  prevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  nextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  render() {
    const { users, isFetching, error } = this.state;

    return (
      <section className={styles.usersLoader}>
        <InputFields
          setFilter={this.setFilter}
          setUserView={this.setUserView}
        ></InputFields>
        <div className={styles.usersContainer}>
          {error && <div>!!!ERROR!!! {JSON.stringify(error)}</div>}
          {isFetching && <div>Loading. Please waite...</div>}
          {!error &&
            !isFetching &&
            this.state.users.map((u) => {
              return (
                <UserItem
                  showLogin={this.state.showLogin}
                  showEmail={this.state.showEmail}
                  user={u}
                  key={u.login.uuid}
                ></UserItem>
              );
            })}

          <div className={styles.pageScroller}>
            <button
              className={classNames(styles.usersScrollBtn, styles.prevBtn)}
              onClick={this.prevPage}
            >
              {"<"}
            </button>
            <span className={styles.pageNumber}>{this.state.currentPage}</span>
            <button
              className={classNames(styles.usersScrollBtn, styles.nextBtn)}
              onClick={this.nextPage}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>
    );
  }
}
