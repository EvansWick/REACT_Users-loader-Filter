import React from "react";
import styles from "./userItem.module.sass";
import PropTypes from "prop-types";
import classNames from "classnames";

function UserItem({ user, showEmail, showLogin }) {
  const {
    name: { first },
    name: { last },
    email,
    login: { username },
  } = user;

  return (
    <article className={styles.userCard}>
      <div className={styles.avatarContainer}>
        <img className={styles.avatarImg} src={user.picture.medium} alt="" />
      </div>
      <div className={styles.userNameInfo}>
        <p className={styles.userName}>{first + " " + last}</p>
        {
          <p
            className={classNames(styles.userLogin, {
              [styles.hiddenText]: !showLogin,
            })}
          >
            {username}
          </p>
        }
      </div>

      <div className={styles.userDataInfo}>
        <p className={classNames(styles.userGender, styles[user.gender])}>
          {user.gender}
        </p>
        {
          <p
            className={classNames(styles.userEmail, {
              [styles.hiddenText]: !showEmail,
            })}
          >
            {email}
          </p>
        }

        <p className={styles.userAge}>{user.dob.age}</p>
      </div>
    </article>
  );
}

UserItem.propTypes = {
  user: PropTypes.object,
};

export default UserItem;
