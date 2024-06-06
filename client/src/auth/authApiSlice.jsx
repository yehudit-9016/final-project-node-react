import apiSlice from "../app/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build)=>({
        getUsers: build.query({
            query: (id)=>({
                url: `/api/user/${id}`
            })
        }),
        getAllUsers: build.query({
            query: ()=>({
                url: "/api/user"
            }),
            providesTags:["users"]
        }),
        register: build.mutation({
            query: (registerUser)=>({
                url: "/api/auth/register",
                method: "POST",
                body: registerUser
            }),
            invalidatesTags:["users"]
        }),
        login: build.mutation({
            query: (loginData)=>({
                url: "/api/auth/login",
                method: "POST",
                body: loginData
            }),
            invalidatesTags:["users"]
        }),
        update: build.mutation({
            query: (user)=>({
                url: "/api/user",
                method: "PUT",
                body: user
            }),
            invalidatesTags:["users"]
        }),
        createUser: build.mutation({
            query: (user)=>({
                url: "/api/user",
                method: "POST",
                body: user
            }),
            invalidatesTags:["users"]
        }),
    
    })
})

export const {useRegisterMutation, useLoginMutation, useUpdateMutation, useGetUsersQuery, useGetAllUsersQuery, useCreateUserMutation} = authApiSlice