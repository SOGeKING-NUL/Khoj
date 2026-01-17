export interface Comments{
    comment: string
};

export interface reelMetadata{
    url: string,
    caption: string,
    transcript: string,
    comments: Comments[],
    shortCode: string,
    thumbnail: string,
    videoURL: string,
}