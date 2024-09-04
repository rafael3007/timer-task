import { HandPalm, Play } from 'phosphor-react'
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from './styles';
import Countdown from './components/Countdown';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from "zod"
import NewCycleForm from './components/NewCycleForm';
import { useContext } from 'react';
import { CyclesContext } from '../../contexts/CyclesContent';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa!"),
    minutesAmount: zod.number()
        .min(5, "O ciclo precisa ser de no mínimo 5 minutos!")
        .max(60, "O ciclo precisa ser de no máximo 60 minutos!"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {
    const { createNewCycle, interruptCycle, activeCycle } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { watch, handleSubmit, reset } = newCycleForm;


    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch("task")
    const isSubmitDisabled = !task


    return (
        <HomeContainer>
            <form action='' onSubmit={handleSubmit(handleCreateNewCycle)}>

                <FormProvider {...newCycleForm}>

                    <NewCycleForm />

                </FormProvider>

                <Countdown />

                {
                    activeCycle ? (
                        <StopCountdownButton onClick={interruptCycle} type="button">
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