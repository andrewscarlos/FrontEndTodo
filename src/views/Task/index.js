import React, { useState , useEffect} from 'react';
import {Redirect} from 'react-router-dom'
import * as S from './styles'
import {format} from 'date-fns'

import api from '../../services/api'
import isConnected from '../../utils/isConnected'

//NOSSOS COMPONENTES
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import TypeIcons from '../../utils/typeIcons'




function Task({match}) {

const [redirect, setRedirect] = useState(false)

const [type, setType] = useState()
//const [id, setId] = useState()
const [done, setDone] = useState(false)
const [title, setTitle]= useState()
const [description, setDescription]= useState()
const [date, setDate]= useState()
const [hour, setHour]= useState()




  
async function LoadTaskDatails(){
    await api.get(`/task/${match.params.id}`)
    .then(response => {
      setType(response.data.type)
      setDone(response.data.done)
      setTitle(response.data.title)
      setDescription(response.data.description)
      setDate(format( new Date (response.data.when), 'yyyy-MM-dd'))
      setHour(format( new Date  (response.data.when), 'HH:mm'))
    })
    
}

  async function Save(){
    // validacao dos dados
    if(!title)
    return alert('Voce precisa informar o título da tarefa')
    else if (!description)
    return alert('Voce precisa informar a descrição da tarefa')
    else if (!type)
    return alert('Voce precisa informar o tipo da tarefa')
    else if (!date)
    return alert('Voce precisa informar a date da tarefa')
    else if (!hour)
    return alert('Voce precisa informar a hora da tarefa')


     if(match.params.id){
      await  api.put(`/task/${match.params.id}`,{
        macaddress: isConnected,
        done,
        type,
        title,
        description,
        when: `${date}T${hour}:00.000`
      }).then(()=>
      setRedirect(true) // atualiza o que ja tem
      )

     }else{

    await  api.post('/task',{
      macaddress: isConnected,
      type,
      title,
      description,
      when: `${date}T${hour}:00.000` // cria um novo
    }).then(()=>
      setRedirect(true)
    )
  }
}

 async function Remove (){
      const res = window.confirm('Deseja realmente remover a tarefa ?')
      if(res === true){
        await api.delete(`/task/${match.params.id}`)
        .then(() => setRedirect (true))
      }
}
  useEffect(()=>{
    if(!isConnected){
      setRedirect(true)
    }
    LoadTaskDatails()
  }, [])

  return (
    <S.Container>
      
      { redirect && <Redirect to="/"/> }
      <Header   />

      <S.Form>

        <S.typeIcons>
          {
            TypeIcons.map((icon, index) => (

              index > 0 &&
              <button type="button" onClick={() => setType(index)} >
               <img src={icon} alt="Tipo da tarefa"
              className={  type && type !== index && 'inative'}/>
              </button>
            ))
          }
        </S.typeIcons>
    

          <S.InputIcons>
            <span>Título</span>
            <input type="text" placeholder="Título da tarefa..." onChange={e => setTitle(e.target.value)} value={title}/>
          </S.InputIcons>

          

          <S.TextArea>
            <span>Descrição</span>
            <textarea rows={5} placeholder="Detalhes da tarefa..." onChange={e => setDescription (e.target.value)} value={description}/>
          </S.TextArea>

          <S.InputIcons>
            <span>Data</span>
            <input type="date" placeholder="Título da tarefa..." onChange={e => setDate (e.target.value)} value={date} />
            
          </S.InputIcons>

          <S.InputIcons>
            <span>Hora</span>
            <input type="time" id="clock" placeholder="Título da tarefa..." onChange={e => setHour (e.target.value)} value={hour}/>
            
          </S.InputIcons>

          <S.Options>
            <div>
              <input type="checkbox" checked={done} onChange={()=> setDone(!done) }/>
              <span>CONCLUÍDO</span>
            </div>
           {match.params.id && <button type="button" onClick={Remove}>EXCLUIR</button>}
          </S.Options>

          <S.Save>
            <button type="button" onClick={Save}>SALVAR</button>
          </S.Save>

      </S.Form>


      <Footer />

      </S.Container>
  )

}

export default Task;
