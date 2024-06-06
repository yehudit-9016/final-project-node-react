import apiSlice from "../app/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (build)=>({
        getProducts: build.query({
            query: ()=>({
                url: "/api/product"
                
            }),
            providesTags:["Product"]
        }),
    
    createProduct: build.mutation({
        query: (product)=>({
            url: "/api/product",
            method: "POST",
            body: product
        }),
        invalidatesTags:["Product"]
    }),
    updateProduct: build.mutation({
        query: (product)=>({
            url: "/api/product",
            method: "PUT",
            body: product
          }),
          invalidatesTags:["Product"]
     }),
     deleteProduct: build.mutation({
        query: (product)=>({
            url: "/api/product",
            method: "DELETE",
            body: product
        }),
        invalidatesTags:["Product"]
     }),
     getProductById: build.query({
        query: (id)=>({
            url: `/api/product/${id}`
        })
    }),
        
    }),
})

export const {useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetProductByIdQuery} = productApiSlice