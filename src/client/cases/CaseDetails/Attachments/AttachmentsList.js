import React from 'react'
import {Typography} from "material-ui";
import AttachmentsRow from "./AttachmentsRow";
import _ from "lodash"

const AttachmentsList = ({attachments}) => (
    <div data-test="attachmentsField" style={{marginBottom: '48px'}}>
        {
            attachments && attachments.length > 0
                ? _.sortBy(attachments, obj => obj.fileName.toUpperCase()).map(attachment => (
                    <AttachmentsRow attachment={attachment} key={attachment.id}/>
                ))
                : (
                    <div>
                        <Typography type='body1'>
                            No files are attached
                        </Typography>
                    </div>
                )
        }
    </div>
)

export default AttachmentsList