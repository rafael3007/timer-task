import { HandPalm, Play } from 'phosphor-react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from './styles';
import { useEffect, useState } from 'react';
import NewCycleForm from './components/NewCycleForm';
import Countdown from './components/Countdown';
import { Cycle } from '../../@types/Cycle';

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

    const {
        register,
        handleSubmit,
        watch,
        reset
    } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)



    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch("task")
    const isSubmitDisabled = !task



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

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {

                const secondsDIfference = differenceInSeconds(new Date(), activeCycle.startDate)

                if (secondsDIfference >= totalSeconds) {
                    setCycles(state =>
                        state.map(cycle => {
                            if (cycle.id === activeCycleId) {
                                return { ...cycle, finishedDate: new Date() };
                            } else {
                                return cycle;
                            };
                        })
                    );

                    setAmountSecondsPassed(totalSeconds)

                    clearInterval(interval);
                } else {
                    setAmountSecondsPassed(secondsDIfference)
                }

            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalSeconds, activeCycleId,])

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    return (
        <HomeContainer>
            <form action='' onSubmit={handleSubmit(handleCreateNewCycle)}>

                <NewCycleForm registro={register}  activeCycle={activeCycle} />

                <Countdown minutes={minutes} seconds={seconds} />

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
            </form>
        </HomeContainer>
    )
}