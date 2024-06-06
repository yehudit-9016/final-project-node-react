import apiSlice from "../app/apiSlice";

const favouriteApiSlice = apiSlice.injectEndpoints({
    endpoints: (build)=>({
        updateFavourite: build.mutation({
            query: (favouriteData)=>({
                url: "/api/user/favourite",
                method: "PUT",
                body: favouriteData
            })
        }),
        deleteFavourite: build.mutation({
            query: (favouriteData)=>({
                url: "/api/user/favourite",
                method: "DELETE",
                body: favouriteData
            }),
            invalidatesTags:["Product"]
        }),

    }),
})

export const {useUpdateFavouriteMutation, useDeleteFavouriteMutation} = favouriteApiSlice