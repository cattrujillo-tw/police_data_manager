import moment from 'moment'
import timezone from 'moment-timezone'

const formatDate = dateString => {
    const date = moment(moment.utc(new Date(dateString)).format('YYYY-MM-DDTHH:mm')).toDate()

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export const timeFromDateString = dateString => {
    return timezone.tz(dateString, 'US/Central').format('h:mm A z')
}

export const applyCentralTimeZoneOffset = dateString => {
    if (dateString) {
        dateString = timezone.tz(dateString, 'US/Central').format()
    }

    return dateString
}

export default formatDate