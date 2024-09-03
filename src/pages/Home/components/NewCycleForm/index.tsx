
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { Cycle } from "../../../../@types/Cycle";

interface NewCycleFormProps {
    registro: unknown;
    activeCycle: Cycle;
}

export default function NewCycleForm({registro, activeCycle}: NewCycleFormProps) {
    return (
        <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput
                id="task"
                list='task-suggestions'
                placeholder="Dê um nome para o projeto"
                disabled={!!activeCycle}
                {...registro("task")}
            />

            <datalist id="task-suggestions">
                <option value="Projeto 1" />
                <option value="Projeto 2" />
                <option value="Projeto 3" />
                <option value="Projeto 4" />
                <option value="Projeto 5" />

            </datalist>

            <label htmlFor="minutesAmount">durante</label>
            <MinutesAmountInput
                type="number"
                id="minutesAmount"
                placeholder="00"
                step={5}
                min={5}
                max={60}
                disabled={!!activeCycle}
                {...registro("minutesAmount", { valueAsNumber: true })}
            />

            <span>minutos.</span>
        </FormContainer>
    )
}
