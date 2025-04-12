const testsContext = require.context('../specs', true, /\.spec\.(js|kdu)$/)

testsContext.keys().forEach(testsContext)
