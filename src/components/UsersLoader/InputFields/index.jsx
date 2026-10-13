import React, { Component } from "react";
import styles from "./InputFields.module.sass";
import PropTypes from "prop-types";

export default class InputFields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterConfig: {
        ageBefore: 100,
        ageAfter: 0,
        gender: "all",
      },
      userConfig: {
        showLogin: false,
        showEmail: false,
      },
    };
  }

  inputChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    let isCorrectData = true;
    if (name === "ageAfter" && newValue < 0) {
      isCorrectData = false;
    }
    if (name === "ageBefore" && newValue > 120) {
      isCorrectData = false;
    }

    if (!isCorrectData) {
      return;
    }

    this.setState((prevState) => {
      if (name !== "showLogin" && name !== "showEmail") {
        return {
          filterConfig: {
            ...prevState.filterConfig,
            [name]: newValue,
          },
        };
      }
      const newUserView = {
        ...prevState.userConfig,
        [name]: newValue,
      };
      this.props.setUserView(newUserView);
      return {
        userConfig: newUserView,
      };
    });
  };

  render() {
    return (
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          this.props.setFilter(this.state.filterConfig);
        }}
      >
        <div className={styles.filterGroup}>
          <span className={styles.groupTitle}>Стать користувачів</span>
          <div className={styles.selectGroup}>
            <label className={styles.filterRow}>
              <select
                onChange={this.inputChangeHandler}
                name="gender"
                value={this.state.filterConfig.gender}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.groupTitle}>Вік</span>
          <div className={styles.numbersInput}>
            <label className={styles.filterRow}>
              <span>Від</span>
              <input
                onChange={this.inputChangeHandler}
                name="ageAfter"
                type="number"
                value={this.state.filterConfig.ageAfter}
              />
            </label>
            <label className={styles.filterRow}>
              <span>До</span>
              <input
                onChange={this.inputChangeHandler}
                name="ageBefore"
                type="number"
                value={this.state.filterConfig.ageBefore}
              />
            </label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.checkboxes}>
            <label className={styles.filterRow}>
              <input
                onChange={this.inputChangeHandler}
                type="checkbox"
                name="showLogin"
                checked={this.state.filterConfig.showLogin}
              />
              <span className={styles.inputLabel}>Показувати логін</span>
            </label>

            <label className={styles.filterRow}>
              <input
                onChange={this.inputChangeHandler}
                type="checkbox"
                name="showEmail"
                checked={this.state.filterConfig.showEmail}
              />
              <span className={styles.inputLabel}>Показувати Email</span>
            </label>
          </div>
        </div>

        <button className={styles.applyFilterButton} type="submit">
          Застосувати фільтр
        </button>
      </form>
    );
  }
}

InputFields.propTypes = {
  setUserView: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
};
