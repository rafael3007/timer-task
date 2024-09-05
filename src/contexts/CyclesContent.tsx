import { createContext, useState, useReducer, useEffect } from "react";
import { Cycle } from "../@types/Cycle";
import { cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

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
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem("@timer-task:cycles-state-1.0.0")

        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }

        return initialState
    })

    const { cycles, activeCycleId }: CyclesState = cyclesState

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {

        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }

        return 0
    })




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

    useEffect(() => {

        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem("@timer-task:cycles-state-1.0.0", stateJSON)

    }, [cyclesState])


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

