
import React, { useEffect } from 'react';
import useCategories from './useCategories';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';



const GlobalContext = React.createContext()


export const GlobalContextProvider = ({ children }) =>{

    const {loading, categories} = useCategories();
    const {user, isLoaded} = useUser();



    //quiz setup page 
    const [quizSetup, setQuizSetup] = React.useState({
      questionsCount: 1,
      category : null,
      difficulty : null,


    }) 
    //getiing quiz id for setup page
    const [selectedQuiz, setSelectedQuiz] = React.useState(null);

    //quiz response
    const [quizResponses, setQuizResponses] = React.useState([]);

    useEffect(()=>{
        if(!isLoaded || !user?.emailAddresses[0]?.emailAddress ) return;

        const registerUser = async ()=>{
            try {
                await axios.post("/api/user/register")
            } catch (error) {
                console.error("Error regisering user", error)
                
            }

        };

        if(user?.emailAddresses[0]?.emailAddress){
            registerUser();
        }
    },[user, isLoaded])

    





    
    //console.log("GlobalContextProvider categories:", categories);
    
    
    return (
        <GlobalContext.Provider 
        value={{ 
            loading,
            categories,
            quizSetup,
            setQuizSetup,
            selectedQuiz,
            setSelectedQuiz,
            quizResponses,
            setQuizResponses

            
        }}>
        {children}
        </GlobalContext.Provider>
    );
    
};


export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
}

