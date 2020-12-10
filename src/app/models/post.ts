export interface Post {
	id?: any;
	author?: {
        displayName:string,
        uid:string
	};
	authorName?:string;
    content?: string;
    created_at?: any ;
    createdAt?: any;
	doc?: any;
    featured_image?:string;
    tags?:Array<any>;
    title?: string;
    uid?: string;
    updatedAt?: any;
    url?:string;
}