import mongoose, {mongo, Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,
            requred: true
        },
        thumbnail: {
            type: String,
            requred: true
        },
        title: {
            type: String,
            requred: true
        },
        description: {
            type: String,
            requred: true
        },
        duration: {
            type: Number,
            required: true
        }, 
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.types.Objectid,
            ref: "User"
        }
    }, {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)