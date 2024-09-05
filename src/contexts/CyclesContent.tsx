import { createContext, useState, useReducer } from "react";
import { Cycle } from "../@types/Cycle";
import { cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    amountSecondsPassed: number;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCycle: () => void;
    cycles: Cycle[];
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: React.ReactNode;
}


export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null,
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleId }: CyclesState = cyclesState



    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }


    function createNewCycle(data: CreateCycleData) {
        const id = new Date().getTime().toString();
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        dispatch(addNewCycleAction(newCycle));

        setAmountSecondsPassed(0)
    }

    function interruptCycle() {

        dispatch(interruptCurrentCycleAction())

    }


    return (
        <CyclesContext.Provider value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            setSecondsPassed,
            amountSecondsPassed,
            createNewCycle,
            interruptCycle,
            cycles
        }}>{children}</CyclesContext.Provider>
    )
}

