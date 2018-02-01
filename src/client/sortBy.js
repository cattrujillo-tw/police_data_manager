import _ from 'lodash'

const STATUS = Object.freeze({
    'Initial': 1,
    'Active': 2,
    'Forwarded': 3,
    'Suspended': 4,
    'Complete': 5
})

const sortBy = (collection, sortBy, sortDirection) => {
    if (sortBy === 'status') {
        if (sortDirection === 'asc') {
            return _.sortBy(collection, [(o) => {
                return STATUS[o.status]
            }])
        }
        if (sortDirection === 'desc'){
            return _.sortBy(collection, [(o) => {
                return STATUS[o.status]
            }]).reverse()
        }
    }

    if (sortBy === 'lastName') {
        const sortedCases = _.sortBy(collection, [(o) => {return o.lastName.toUpperCase()}])
         if (sortDirection === 'desc') {
            return sortedCases.reverse()
         }
         else return sortedCases
    }

    return _.orderBy(collection, sortBy, sortDirection)
}

export default sortBy