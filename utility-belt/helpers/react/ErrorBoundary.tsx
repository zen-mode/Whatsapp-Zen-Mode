/* eslint-disable functional/no-class, functional/no-this-expression, react/no-set-state */
import React from "react";

import pick_random_NP_from from "../array/pick-random";

// todo-team: make this a HOC so that we can properly wrap components itself, instead of wrapping their parents. ie, currently if an error happens in a component - his parent goes down, instead of him
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true});
    // todo-2: log the error to an error reporting service
    // logErrorToMyService(error, info);
    return void 0;
  }

  // noinspection FunctionWithMultipleReturnPointsJS
  render() {
    if (this.state.hasError) {
      const errorTypes = [
        "Разрушительнейший",
        "Ужасающий",
        "Невероятный",
        "Поливалентный",
        "Биполярный",
        "Орбитальный",
        "Межгалактический",
        "Смертоносный",
      ];
      // You can render any custom fallback UI
      return (
        <h3 style={{color: "orange"}}>
          {/*// todo-2: change the text when error reporting service is online */}
          {`Произошёл ${pick_random_NP_from(errorTypes)}`} сбой! 🤕
          <br />
          Скорее сообщите в{" "}
          <a href="mailto: support@bankaria.ru?subject=Ошибка интерфейса&body=Привет! У меня вылезла ошибка, когда я... (опишите, пжл, какая последовательность действий приводит к ошибке, чтобы мы смогли повторить и устранить)">
            службу поддержки
          </a>
          ! Мы всё исправим 🛠️ и вы снова сможете наслаждаться работой в БанкАрии 🚀
        </h3>
      );
    }
    return this.props.children;
  }
}
