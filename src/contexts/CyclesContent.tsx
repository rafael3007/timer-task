import { createContext, useState } from "react";
import { Cycle } from "../@types/Cycle";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
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

    const [cycles, setCycles] = useState<Array<Cycle>>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)


    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles(state =>
            state.map(cycle => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() };
                } else {
                    return cycle;
                };
            })
        );
    }


    function createNewCycle(data: CreateCycleData) {

        const id = new Date().getTime().toString();
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0)
    }

    function interruptCycle() {


        setCycles(state => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptDate: new Date() };
            } else {
                return cycle;
            };
        }));

        setActiveCycleId(null);

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

