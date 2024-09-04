import { HandPalm, Play } from 'phosphor-react'
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from './styles';
import { createContext, useState } from 'react';
// import NewCycleForm from './components/NewCycleForm';
import Countdown from './components/Countdown';
import { Cycle } from '../../@types/Cycle';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from "zod"
import NewCycleForm from './components/NewCycleForm';


interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    amountSecondsPassed: number;
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa!"),
    minutesAmount: zod.number()
        .min(5, "O ciclo precisa ser de no mínimo 5 minutos!")
        .max(60, "O ciclo precisa ser de no máximo 60 minutos!"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {

    const [cycles, setCycles] = useState<Array<Cycle>>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)



    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { watch, handleSubmit, reset } = newCycleForm;

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const task = watch("task")
    const isSubmitDisabled = !task

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


    function handleCreateNewCycle(data: NewCycleFormData) {

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

        reset();
    }

    function handleInterruptCycle() {


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
        <HomeContainer>
            <form action='' onSubmit={handleSubmit(handleCreateNewCycle)}>
                <CyclesContext.Provider value={{
                    activeCycle,
                    activeCycleId,
                    markCurrentCycleAsFinished,
                    setSecondsPassed,
                    amountSecondsPassed,
                }}>
                    <FormProvider {...newCycleForm}>

                        <NewCycleForm />

                    </FormProvider>

                    <Countdown />

                    {
                        activeCycle ? (
                            <StopCountdownButton onClick={handleInterruptCycle} type="button">
                                <HandPalm size={24} />
                                Interromper
                            </StopCountdownButton>
                        ) : (
                            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                                <Play size={24} />
                                Começar
                            </StartCountdownButton>
                        )
                    }
                </CyclesContext.Provider>

            </form>
        </HomeContainer>
    )
}