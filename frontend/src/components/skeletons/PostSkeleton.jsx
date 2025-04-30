import React from 'react'

const PostSkeleton = () => {
  return (
    <div>
        <div>
            <div>
                <div className='skeleton'></div>
                <div>
                    <div className='skeleton'></div>
                    <div className='skeleton'></div>
                </div>
            </div>
        </div>
        <div className='skeleton'></div>
    </div>
  )
}

export default PostSkeleton
