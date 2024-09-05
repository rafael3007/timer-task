
import { useContext } from 'react'
import { HistoryContainer, HistoryList, Status } from './styles'
import { CyclesContext } from '../../contexts/CyclesContent'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from "date-fns/locale";

export function History() {
    const { cycles } = useContext(CyclesContext)

    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Duração</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cycles.map((cycle) => {
                                return (
                                    <tr key={cycle.id}>
                                        <td>{cycle.task}</td>
                                        <td>{cycle.minutesAmount} minutos</td>
                                        <td>{formatDistanceToNow(new Date(cycle.startDate), {
                                            locale: ptBR,
                                            addSuffix: true
                                        })}</td>
                                        <td>
                                            {
                                                cycle.finishedDate && <Status statusColor='green'>Concluído</Status>
                                            }

                                            {
                                                cycle.interruptDate && <Status statusColor='red'>Finalizado</Status>
                                            }

                                            {
                                                !cycle.interruptDate && !cycle.finishedDate && (<Status statusColor='yellow'>Andamento</Status>)
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}