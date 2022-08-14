import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'
import {v4 as uuid} from 'uuid'

const PETS_FIELDS =gql`
fragment PetFields on Pet {
  id
  name
  type
  img
  vaccinated @client
  owner{
    id
    age @client
  }
}
`

const ALL_PETS = gql`
query allPets{
  pets{
   ... PetFields
  }
}${PETS_FIELDS}
`
const ADD_PET=gql`
mutation addPet($input: NewPetInput!) {
  addPet(input: $input) {
    ... PetFields
  }
}${PETS_FIELDS}`
export default function Pets () {
  const [modal, setModal] = useState(false)

  const {data,loading ,error} = useQuery(ALL_PETS)
  const [createPet,petData] = useMutation(ADD_PET,{
    update(cache,{data:{addPet}}){
      const {pets} = cache.readQuery({query:ALL_PETS})
      cache.writeQuery({
        query:ALL_PETS,
        data:{pets:[addPet,...pets]}
      })
    }
})
  const onSubmit = input => {
    setModal(false)
    createPet({
      variables:{input: input},
      optimisticResponse:{
        __typename:'mutation',
        addPet:{
          __typename:'Pet',
          id:uuid(),
          name:input.name,
          type:input.type,
          img:''
        }
      }
    })
  }
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }
  if(loading){
    return <Loader/>
  }
  if(error || petData.error){
    return <p>this is an error</p>
  }
  console.log(data.pets[0])
  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList  pets={data.pets}/>
      </section>
    </div>
  )
}
