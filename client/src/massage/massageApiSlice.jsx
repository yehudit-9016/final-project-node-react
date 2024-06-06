import apiSlice from "../app/apiSlice";

const massageApiSlice = apiSlice.injectEndpoints({
    endpoints: (build)=>({
        getMassages: build.query({
            query: ()=>({
                url: "/api/massage/",
            }),
        }),
        updateMassage: build.mutation({
            query: (massage)=>({
                url: "/api/massage",
                method: "PUT",
                body: massage
            }),
        }),
        createMassage: build.mutation({
            query: (massage)=>({
                url: "/api/massage",
                method: "POST",
                body: massage
            }),
        }),
    }),
})

export const {useGetMassagesQuery, useUpdateMassageMutation, useCreateMassageMutation} = massageApiSlice