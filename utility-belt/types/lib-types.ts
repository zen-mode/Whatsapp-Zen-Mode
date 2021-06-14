import * as moment from "moment";
import React, {Dispatch, SetStateAction} from "react";

export type Moment = moment.Moment;

export type InputChangeEvt = React.FormEvent<HTMLInputElement>;
export type ReactStateMutuator<T> = Dispatch<SetStateAction<T>>;
