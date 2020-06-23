import React , {useMemo} from 'react';
import typeIcons from '../../utils/typeIcons'
import { format } from 'date-fns'
import * as S from './styles'




function TaskCard({type, title, when}  ) {
    const date = useMemo(() => format(new Date(when), 'dd/MM/yyyy') )
    const hour = useMemo(() => format(new Date(when), 'HH:mm') )

  return (
    <S.Container>
        <S.TopCard>
          <img src={typeIcons[type]} alt="Icone da Tarefa"/>
          <h1>{title} </h1>
        </S.TopCard>

        <S.BottomCard>
          <strong>{date}</strong>
          <span>{hour}</span>
        </S.BottomCard>

    </S.Container>
  )
}
  
export default TaskCard
