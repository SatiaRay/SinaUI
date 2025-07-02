import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { workspaceEndpoints } from "../utils/apis";
import { useAuth } from "./AuthContext";

export const WorkspaceContext = createContext(null)


export const WorkspaceProvider = ({ children }) => {
    const { check: authCheck } = useAuth()

    const [all, setAll] = useState([]);

    const [currentWorkspace, setCurrentWorkspace] = useState(JSON.parse(localStorage.getItem('workspace')))

    const sendSelectWorkspaceRequest = async () => {
        return await workspaceEndpoints.selectWorkspace(currentWorkspace.id)
    }

    if (authCheck() && !all.length) {
        const fetchWorkspaces = async () => {
            const res = await workspaceEndpoints.listWorkspaces(1, 100);

            setAll(res.workspaces);
        };

        fetchWorkspaces();
    }

    useEffect(() => {
        if (!currentWorkspace && all && all.length)
            setCurrentWorkspace(all[0])
    }, [all])

    useEffect(() => {
        if (!currentWorkspace)
            localStorage.clear('workspace')
        else {
            try {
                sendSelectWorkspaceRequest()    
                
                localStorage.setItem('workspace', JSON.stringify(currentWorkspace))
            } catch (error) {
                console.error(`There is error in select current workspace in the server: ${error.message}`);
            }
        }
    }, [currentWorkspace])

    const selectWorkspace = (id) => {
        if (!Number.isInteger(id))
            throw new Error(`Workspace id should be number but passed ${id}`)

        setCurrentWorkspace(id)
    }

    return (
        <WorkspaceContext.Provider value={{ all, currentWorkspace, selectWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export const useWorkspace = () => useContext(WorkspaceContext)